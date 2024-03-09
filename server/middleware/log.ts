export default defineEventHandler( (event) => {
    const path = event.path
    const method = event.method.padEnd(4, " ")
    console.log(`  ${method} => ${path}`)
})