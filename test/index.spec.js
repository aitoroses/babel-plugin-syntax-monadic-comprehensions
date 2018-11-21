import Identity, { For, Yield } from './Identity'

describe('for-syntax', function(){
    it('test', () => {
        
        const comp = For(() => {
            const a = Yield(Identity.pure(1))
            const b = Yield(Identity.pure(1))
            return a + b
        })

        expect(comp.value).toBe(2)
    })
});
