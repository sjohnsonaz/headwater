import { expect } from 'chai';

import { run } from '../scripts/main';

describe('run', () => {
    it('should return "Application started..."', () => {
        expect(run()).to.equal('Application started...');
    });
});

describe('Dom', () => {
    it('should have window', () => {
        expect(window).to.not.be.undefined;
    });

    it('should have document', () => {
        expect(document).to.not.be.undefined;
    });

    it('should have document.createElement', () => {
        var element = document.createElement('div');
        expect(element.tagName.toLowerCase()).to.equal('div');
    });
});