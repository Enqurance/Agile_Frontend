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
    1: "orange",
    2: "green",
    3: "red",
    4: "yellow",
    5: "grey",
    6: "blue",
    7: "pink"
}

let pin_state_dic = {
    0: "可申请为公共钉",
    1: "待审批",
    2: "申请冷却",
}

let pin_public_state_dic = {
    0: "反馈",
    1: "待审批",
    2: "申请冷却",
}

let pin_state_color_dic = {
    0: "#66ff99",
    1: "#ff9999",
    // 2: "red",
}

function get_pin_type(pin_type_id) {
    // 如果不存在id，则输出""
    return pin_type_dic[pin_type_id]
}

function get_pin_color(pin_type_id) {
    // 如果不存在id，则输出""
    return pin_color_dic[pin_type_id]
}

function get_pin_state(pin_state_id) {
    // 如果不存在id，则输出""
    return pin_state_dic[pin_state_id]
}

function get_public_pin_state(pin_state_id) {
    // 如果不存在id，则输出""
    return pin_public_state_dic[pin_state_id]
}

function get_pin_state_color(pin_state_id) {
    // 如果不存在id，则输出""
    return pin_state_color_dic[pin_state_id]
}

let user_type_administrator = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6OSwiZXhwIjoxNjg0NDIwMDA4LCJpYXQiOjE2ODQ0MTY0MDh9.1vyPE06rkFosfXzwCJbWmkFJHhZ8w3l1zBMmFY8aMUo'

export default {get_pin_type, get_pin_color, get_pin_state, get_public_pin_state, get_pin_state_color, user_type_administrator}