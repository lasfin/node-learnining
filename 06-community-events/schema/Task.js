'use strict';

exports = module.exports = function(app, mongoose) {
    var taskSchema = new mongoose.Schema({
        name: { type: String, required: true},
        description: { type: String},
        date: { type: Date},
        startTime: { type: String},
        endTime: { type: String},
        username: { type: String, required: true},
        search: [String]
    });
    taskSchema.plugin(require('./plugins/pagedFind'));
    taskSchema.index({name: 1});
    taskSchema.index({username: 1});
    taskSchema.index({date: 1});
    taskSchema.index({startTime: 1});
    taskSchema.index({endTime: 1});
    taskSchema.index({user: 1});

    taskSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Task', taskSchema);
};
