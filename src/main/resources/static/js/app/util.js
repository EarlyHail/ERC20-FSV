const $ = (selector, baseNode = document) => {
    return baseNode.querySelector(selector);
};

const $$ = (selector, baseNode = document) => {
    return baseNode.querySelectorAll(selector);
};