/**
 * Simple Neural Network (simpleNN.js)
 * A lightweight, dependency-free MLP implementation.
 */
class SimpleNN {
    constructor(config = {}) {
        this.inputNodes = config.inputNodes || 1;
        this.hiddenNodes = config.hiddenNodes || 10;
        this.outputNodes = config.outputNodes || 1;
        this.learningRate = config.learningRate || 0.1;

        // Weights
        this.weightsIH = Array.from({ length: this.hiddenNodes }, () =>
            Array.from({ length: this.inputNodes }, () => Math.random() * 2 - 1)
        );
        this.weightsHO = Array.from({ length: this.outputNodes }, () =>
            Array.from({ length: this.hiddenNodes }, () => Math.random() * 2 - 1)
        );

        // Biases
        this.biasH = Array.from({ length: this.hiddenNodes }, () => Math.random() * 2 - 1);
        this.biasO = Array.from({ length: this.outputNodes }, () => Math.random() * 2 - 1);
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    sigmoidDerivative(x) {
        return x * (1 - x);
    }

    predict(inputArray) {
        // Hidden Layer
        let hidden = this.weightsIH.map((row, i) => {
            let sum = row.reduce((acc, weight, j) => acc + weight * inputArray[j], 0);
            return this.sigmoid(sum + this.biasH[i]);
        });

        // Output Layer
        let output = this.weightsHO.map((row, i) => {
            let sum = row.reduce((acc, weight, j) => acc + weight * hidden[j], 0);
            return this.sigmoid(sum + this.biasO[i]);
        });

        return output;
    }

    train(inputArray, targetArray) {
        // Forward Pass
        let hidden = this.weightsIH.map((row, i) => {
            let sum = row.reduce((acc, weight, j) => acc + weight * inputArray[j], 0);
            return this.sigmoid(sum + this.biasH[i]);
        });

        let output = this.weightsHO.map((row, i) => {
            let sum = row.reduce((acc, weight, j) => acc + weight * hidden[j], 0);
            return this.sigmoid(sum + this.biasO[i]);
        });

        // Calculate Output Errors
        let outputErrors = targetArray.map((target, i) => target - output[i]);

        // Calculate Hidden Layer Errors (Backpropagation)
        let hiddenErrors = Array.from({ length: this.hiddenNodes }, (_, i) => {
            return this.weightsHO.reduce((acc, row, j) => acc + row[i] * outputErrors[j], 0);
        });

        // Update Weights (Hidden to Output)
        this.weightsHO = this.weightsHO.map((row, i) => {
            let gradient = outputErrors[i] * this.sigmoidDerivative(output[i]);
            this.biasO[i] += gradient * this.learningRate;
            return row.map((weight, j) => weight + gradient * hidden[j] * this.learningRate);
        });

        // Update Weights (Input to Hidden)
        this.weightsIH = this.weightsIH.map((row, i) => {
            let gradient = hiddenErrors[i] * this.sigmoidDerivative(hidden[i]);
            this.biasH[i] += gradient * this.learningRate;
            return row.map((weight, j) => weight + gradient * inputArray[j] * this.learningRate);
        });
    }

    toJSON() {
        return {
            weightsIH: this.weightsIH,
            weightsHO: this.weightsHO,
            biasH: this.biasH,
            biasO: this.biasO,
            config: {
                inputNodes: this.inputNodes,
                hiddenNodes: this.hiddenNodes,
                outputNodes: this.outputNodes
            }
        };
    }

    fromJSON(json) {
        this.weightsIH = json.weightsIH;
        this.weightsHO = json.weightsHO;
        this.biasH = json.biasH;
        this.biasO = json.biasO;
        this.inputNodes = json.config.inputNodes;
        this.hiddenNodes = json.config.hiddenNodes;
        this.outputNodes = json.config.outputNodes;
    }
}

export default SimpleNN;
