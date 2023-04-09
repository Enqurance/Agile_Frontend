let global_user_id = ''
let global_token = ''
// true : 管理员
let global_type = false

let pin_type_dic = {
    1: "教室",
    2: "食堂",
    3: "宿舍",
    4: "办公",
    5: "运动",
    6: "超市",
    7: "学习",
}

function get_pin_type(pin_type_id) {
    // 如果不存在id，则输出""
    return pin_type_dic[pin_type_id]
}

export default {global_user_id, global_token, global_type, get_pin_type}