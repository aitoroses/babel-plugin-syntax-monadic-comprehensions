
export default function (babel) {
    const {types: t} = babel;

    return {
        name: "for-syntax", // not required
        visitor: {
            Program(programPath) {

                // Resolve if the program should use imports (For import is used)
                let shouldImport = false
                let importPathLibrary = null
                programPath.traverse({
                    ImportSpecifier(specifierPath) {
                        shouldImport = true
                        importPathLibrary = specifierPath.parent.source.value
                    }
                })


                if (shouldImport) {

                    const imports = ['flatMap', 'map']

                    programPath.traverse({
                        ImportSpecifier(importSpecifier) {
                            // Lookup for flatMap and map operators
                            const name = importSpecifier.node.imported.name
                            const index = imports.indexOf(name)
                            if (index > -1) {
                                imports.splice(index, 1)
                            }
                        },
                    })

                    const specifiers = imports.map(specifier =>
                        t.ImportSpecifier(t.identifier(specifier), t.identifier(specifier))
                    )

                    if (specifiers.length !== 0 && shouldImport) {
                        programPath.node.body.unshift(t.ImportDeclaration(
                            specifiers,
                            t.StringLiteral(importPathLibrary)
                        ))
                    }
                }
            },
            CallExpression(forPath) {
                if (forPath.node.callee.name === "For") {
                    forPath.traverse({
                        "FunctionExpression|ArrowFunctionExpression"(fnPath) {

                            // Find yield declarations
                            const yields = [];
                            fnPath.traverse({
                                VariableDeclaration(declarationPath) {
                                    declarationPath.traverse({
                                        CallExpression(callPath) {
                                            // Is yield type
                                            const isYield = callPath.node.callee.name === "Yield";
                                            isYield && yields.push(declarationPath);
                                        }
                                    });
                                },
                            });

                            // Group Yield declaration with their descendent expressions
                            let p = []
                            let exprs = [...fnPath.node.body.body]
                            for (let yIndex = yields.length - 1; yIndex >= 0; yIndex--) {
                                const yi = yields[yIndex]
                                let yiExprs = []
                                for (let exprIndex = exprs.length - 1; exprIndex >= 0; exprIndex--) {
                                    const expr = exprs[exprIndex]
                                    if (expr == yi.node) {
                                        yiExprs = exprs.slice(exprIndex + 1, exprs.length)
                                        exprs = exprs.slice(0, exprIndex)
                                        break
                                    }

                                }
                                p.unshift([yi, yiExprs])
                            }

                            if (p.length === 0) {
                                throw Error("Don't use monad comprehensions if you're not gonna yield")
                            }

                            function recurBlock(current, yields) {
                                if (yields.length === 0) {
                                    return current
                                } else {
                                    const [yieldPath, exprs] = yields.shift()
                                    const yieldParamName = yieldPath.node.declarations[0].id.name
                                    let yieldParam;
                                    yieldPath.traverse({
                                        CallExpression(path) {
                                            yieldParam = path.node
                                        }
                                    })
                                    const newBlock = t.BlockStatement([...exprs, current].filter(Boolean))
                                    const flatFn = t.ArrowFunctionExpression([t.identifier(yieldParamName)], newBlock)
                                    const flatMapExp = t.CallExpression(t.identifier(current ? "flatMap" : "map"), [yieldParam, flatFn]);
                                    const returnStatement = t.ReturnStatement(flatMapExp);
                                    return recurBlock(returnStatement, yields)
                                }
                            }

                            const returnStatement = recurBlock(null, [...p].reverse())

                            forPath.replaceWith(
                                returnStatement.argument
                            )
                        }
                    });
                }
            }
        }
    };
}
