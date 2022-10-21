export default function Link(userid, link) {
    var base_url = "https://link-to.net/" + userid + "/" + Math.random() * 1e3 + "/dynamic/";
    var href = base_url + "?r=" + btoa(encodeURI(link.toString()));
    return href;
}