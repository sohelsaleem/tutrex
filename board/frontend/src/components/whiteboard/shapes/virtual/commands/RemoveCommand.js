import Command from './Command';

export default class RemoveCommand extends Command {
    execute(item) {
        item.visible = false;
    }

    undo(item) {
        item.visible = true;
    }
}
