import React, { Component } from 'react';
import axios from "axios";

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        try {
            const values = await axios.get('api/values/current');
            this.setState({ values: values.data });
        } catch (error) {
            console.error("Failed to get the current value: ", error);
        }
    }

    async fetchIndexes() {
        try {
            const seenIndexes = await axios.get('api/values/all');
            this.setState({ seenIndexes: seenIndexes.data });
        } catch (error) {
            console.error("Failed to get all values: ", error);
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });

        this.setState({ index: '' });
    }

    renderSeenIndexes() {
        let seen;

        try {
            seen = this.state.seenIndexes
            .map(({number}) => number)
            .join(', ');
        } catch {
            seen = 'Error'
        }

        return seen;
    }

    renderValues() {
        const entries = [];
        for (const key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }

        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Index I have seen:</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated values:</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;