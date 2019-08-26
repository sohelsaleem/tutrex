export default class Command {
    execute(item) {
        throw new Error('This method should be override');
    }

    undo(item) {
        throw new Error('This method should be override');
    }
}
