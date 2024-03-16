import React from 'react';
import { NextPageContext } from 'next';

interface moodifyProps {
    statusCode?: number;
}

class MeineSeite extends React.Component<moodifyProps> {
    static async getInitialProps() {
        // Simuliere einen internen Serverfehler
        throw new Error('Interner Serverfehler');
    }

    render() {
        return (
            <div>
                <p>hallo hier ist ein fehler</p>
            </div>
        );
    }
}

export default MeineSeite;
