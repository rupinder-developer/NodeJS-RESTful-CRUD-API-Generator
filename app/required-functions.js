patchControllerFunc = (modelName) => {
    return `
    ${modelName}.updateOne({_id: req.pramas.id}, req.body).then(result => {
        if (result.nModified > 0) {
            res.status(201).json({
                response: true,
                msg: 'Resource Updated!'
            });
        } else {
            const error = new Error('Resources not modified!');
            error.status = 304;
            next(error);
        }
        
    }).catch(err => {
        const error = new Error(err);
        next(error);
    });`;
}

deleteControllerFunc = (modelName) => {
    return `
    ${modelName}.deleteOne({_id: req.pramas.id}).then(result => {
        res.status(202).json({
            response: true,
            msg: 'Resource Deleted!'
        });
    }).catch(err => {
        const error = new Error(err);
        next(error);
    });`
}

saveControllerFunc = (modelName, schema) => {
    return `
    const ${schema} = new ${modelName}(req.body);
    ${schema}.save().then(result => {
        res.status(201).json({
            response: true,
            msg: 'Resource Saved!',
            result
        })
    }).catch(err => {
        const error = new Error(err);
        error.status = 422;
        next(error);
    })`
}

getControllerFunc = (modelName) => {
    return `
    ${modelName}.find({}).then(result => {
        res.status(200).json({
            response: true,
            msg: 'Resources Retrived!',
            result
        })
    }).catch(err => {
        const error = new Error(err);
        next(error);
    });`
}