let global_token = ''
// true : 管理员
let global_type = false

let pin_type_dic = {
    1: "餐饮",
    2: "园地",
    3: "教学",
    4: "体育",
    5: "办公",
    6: "购物",
    7: "生活服务",
}

let pin_color_dic = {
    1: "red",
    2: "blue",
    3: "black",
    4: "yellow",
    5: "green",
    6: "orange",
    7: "purple"
}

function get_pin_type(pin_type_id) {
    // 如果不存在id，则输出""
    return pin_type_dic[pin_type_id]
}

function get_pin_color(pin_type_id) {
    // 如果不存在id，则输出""
    return pin_color_dic[pin_type_id]
}

export default {global_token, global_type, get_pin_type, get_pin_color}