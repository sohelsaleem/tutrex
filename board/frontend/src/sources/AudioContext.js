const audioContext = createAudioContext();

function createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return AudioContext && new AudioContext();
}

export function getAudioContext() {
    return audioContext;
}
