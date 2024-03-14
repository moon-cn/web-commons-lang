function contains(str, sub) {
    if (!str) {
        return str
    }
    return str.includes(sub)
}

function substringAfter(str, sub) {
    if (!str) {
        return str;
    }

    const index = str.indexOf(sub)
    return index === -1 ? "" : str.substring(index + 1);
}
function substringBefore(str, sub) {
    if (!str && !sub) {
        return str;
    }

    const index = str.indexOf(sub)
    return index === -1 ? "" : str.substring(0,index);
}

export default {
    contains,
    substringBefore,
    substringAfter
}