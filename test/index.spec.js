import Identity, { For, Yield } from './Identity'

describe('for-syntax', function(){
    describe('For', () => {

        it('without yield should fail at compile time', () => {
            // expect(() => For(() => {})).toThrow()
        })

        it('two yields', () => {
        
            const comp = For(() => {
                const a = Yield(Identity.pure(1))
                const b = Yield(Identity.pure(1))
                return a + b
            })
    
            expect(comp.value).toBe(2)
        })
    
        it('two yields', () => {
            const comp = For(() => {
                let a = Yield(Identity.pure(1))
                if (a === 1) {
                    a = 2
                } 
                const b = Yield(Identity.pure(1))
                return a + b
            })
    
            expect(comp.value).toBe(3)
        })
    
        it('three yields', () => {
            const comp = For(() => {
                let a = Yield(Identity.pure(1))
                if (a === 1) {
                    a = 2
                } 
                const b = Yield(Identity.pure(1))
                return a + b
            })
    
            expect(comp.value).toBe(3)
        })

        it('three yields with no return', () => {
            const comp = For(() => {
                let a = Yield(Identity.pure(1))
                if (a === 1) {
                    a = 2
                } 
                const b = Yield(Identity.pure(1))
                a + b
            })
    
            expect(comp.value).toBe(undefined)
        })

        it('reference outside identifier', () => {
            const comp1 = For(() => {
                let a = Yield(Identity.pure(1))
                if (a === 1) {
                    a = 2
                } 
                const b = Yield(Identity.pure(1))
                return a + b
            })

            const comp2 = For(() => {
                const a = Yield(comp1)
                console.log(a)
                return a + 5
            })
    
            expect(comp2.value).toBe(8)
        })
    })

    describe('Yield', () => {

        it('should fail if outside of for', () => {
            /*expect(() => {
                const a = Yield(1)
            }).toThrow()*/
        })

        it('should not compile if not just one argument', () => {
            // Wont compile
            /*const result = For(() => {
                const a = Yield()
            })*/
            /*const result = For(() => {
                const a = Yield(1,2,3)
            })*/

        })

        it('should be used only in VariableDeclaration', () => {
            /*const one = Identity.pure(1)
            const result = For(() => {
                const a = Yield(one)
            })
            */
        })

    })
})
