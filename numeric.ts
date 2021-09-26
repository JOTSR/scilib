export default class Numeric {
    /**
     * Parse a strign to a Numeric
     * @param _string number, algebric = a+bi, trigonometric = r * (cos(θ) + i * sin(θ)), exponential = r * e^(θi) (case insensitive and spaces are allowed)
     * @returns Parsed numeric
     */
    static fromString(_string: string): {re: number, img: number} {
        const string = _string.replace(' ', '')
        if(string.match(/(-*\d+\.*\d*){0,1}\*{0,1}\(cos\((-*\d+\.*\d*)+\)\+i\*sin\((-*\d+\.*\d*)+\)\)/gi)) {
            const r = Number(string.split(/\*\(cos\((-*\d+\.*\d*)+\)\+i\*sin\((-*\d+\.*\d*)+\)\)/gi)[0])
            const θ = Number(string.split(/(-*\d+\.*\d*)+\*\(cos\(/gi)[1].split(/\)\+i\*sin\((-*\d+\.*\d*)+\)\)/gi)[0])
            return {re: r * Math.cos(θ), img: r * Math.sin(θ)}
        }
        if(string.match(/(-*\d+\.*\d*){0,1}\*{0,1}(e\^)\((-*\d+\.*\d*){0,1}\)/gi)) {
            const r = Number(string.split(/\*/gi)[0]) ?? 0
            const θ = Number(string.split(/e\^\(/gi)[1].split(/\)/gi)[0]) ?? 0
            return {re: r * Math.cos(θ), img: r * Math.sin(θ)}
        }
        if(string.match(/(-*\d+\.*\d*){0,1}(\+|\-){0,1}(-*\d+\.*\d*i*){0,1}/gi)) {
            const a = Number(string.split(/(\+|\-)/gi)[0])
            const b = Number(string.split(/(\+|\-)/gi)[1].split('i')[0])
            return {re: a, img: b}
        }
        return {re: Number(_string), img: 0}
    }

    constructor(protected re: number, protected img: number) {}

    /**
     * Convert a Numeric to a String
     * @param mode algebric = a+bi, trigonometric = r * (cos(θ) + i * sin(θ)), exponential = r * e^(θi)
     * @returns Stringified numeric
     */
    toString(mode: 'algebric' | 'trigonometric' | 'exponential' = 'algebric'): string {
        const imgSign = Math.sign(this.img) < 0 ? '-' : '+'
        if (mode === 'algebric') return `${this.re} ${imgSign} ${this.img}i`
        const r = Math.sqrt(this.re ** 2 + this.img ** 2)
        const θ = (Math.acos(this.re / r) + Math.asin(this.img / r)) / 2
        if (mode === 'trigonometric') return `${r} * (cos(${θ}) + i * sin(${θ}))`
        const rSign = Math.sign(r) < 0 ? '-' : ''
        if (mode === 'exponential') return `${r} * e^(${rSign}${θ}i)`
        return ''
    }
    
    get value() {
        return {re: this.re, img: this.img}
    }

    set value(numeric: {re?: number, img?: number}) {
        this.re = numeric.re ?? this.re
        this.img = numeric.img ?? this.img
    }
}