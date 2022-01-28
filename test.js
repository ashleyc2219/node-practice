function func1(n) {
    return new Promise((resolve, reject)=>{
        if (n == 1) {
            console.log(n);
            resolve('success!');
        }
    })
};

func1(1).then(()=>{
    console.log(3);
})