export default function (command, item) {
    item.commandId = command.id;
    item.tool = command.tool;
    item.applyMatrix = false;
}
