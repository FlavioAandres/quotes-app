module.exports.shuffle = (array=[])=>{
    return (array.sort(() => Math.random() - 0.5)) || [];
}