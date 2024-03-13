let min_acousticness: number;
let max_acousticness: number;
let target_acousticness: number;

let min_danceability: number;
let max_danceability: number;
let target_danceability: number;

let min_energy: number;
let max_energy: number;
let target_energy: number;

let min_instrumentalness: number;
let max_instrumentalness: number;
let target_instrumentalness: number;

let min_liveness: number;
let max_liveness: number;
let target_liveness: number;

let min_loudness: number;
let max_loudness: number;
let target_loudness: number;

let min_mode: number;
let max_mode: number;
let target_mode: number;

let min_speechiness: number;
let max_speechiness: number;
let target_speechiness: number;

let min_tempo: number;
let max_tempo: number;
let target_tempo: number;

let min_valence: number;
let max_valence: number;
let target_valence: number;

interface attribute {
    attr: string;
    value: number;
}

class MoodTransformationAttributes {
    createResponse(attributes: [attribute, attribute, attribute], url: string) {
        return url.concat(
            attributes[0].attr, "=", String(attributes[0].value), "&",
            attributes[1].attr, "=", String(attributes[1].value), "&",
            attributes[2].attr, "=", String(attributes[2].value)
        );
    }

    angry_happy(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_valence", value: 0.8};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.7};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    angry__energized(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_valence", value: 0.8};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.7};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    angry_relaxed(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_valence", value: 0.8};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.7};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    angry_concentrated(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_valence", value: 0.8};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.7};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    tired_happy(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    tired_energized(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    tired_relaxed(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    tired_concentrated(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    stressed_happy(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    stressed_energized(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    stressed_relaxed(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    stressed_concentrated(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    shocked_happy(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    shocked_energized(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    shocked_relaxed(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }

    shocked_concentrated(url: string) {
        let _attribute1: attribute = {attr: "target_energy", value: 1.0};
        let _attribute2: attribute = {attr: "target_acousticness", value: 0.6};
        let _attribute3: attribute = {attr: "target_tempo", value: 0.8};
        return this.createResponse([_attribute1, _attribute2, _attribute3], url);
    }
}

export default MoodTransformationAttributes;