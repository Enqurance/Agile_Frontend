<template>
    <el-cascader
        v-model="value"
        :options="options"
        :props="props"
        placeholder="请选择Tag"
        :show-all-levels="false">
    </el-cascader>
</template>

<script>
import global from "@/global";

export default {
    name: "PostBindPin",
    props: [
        'is_switch'
    ],
    emits: [
        'get_bind_pins'
    ],
    data() {
        return {
            value: [],
            options: [
                {
                    value: "tag1",
                    label: "餐饮",
                    children: []
                },
                {
                    value: "tag2",
                    label: "园地",
                    children: []
                }, {
                    value: "tag3",
                    label: "教学",
                    children: []
                }, {
                    value: "tag4",
                    label: "体育",
                    children: []
                }, {
                    value: "tag5",
                    label: "办公",
                    children: []
                }, {
                    value: "tag6",
                    label: "购物",
                    children: []
                }, {
                    value: "tag7",
                    label: "生活服务",
                    children: []
                }],
            props: {
                multiple: true
            },
        }
    },
    computed: {
        bind_pins() {
            let pins = []
            this.value.forEach(item => pins.push(item[1]))
            return pins
        }
    },
    mounted() {
        let get_tag_label = (tag_x) => {
            return global.get_pin_type(parseInt(tag_x.substring(3)))
        }

        let that = this
        this.$axios.get('/map/pin/getAllPublicPin', {
            headers: {
                'token': that.$cookies.get('user_token')
            }
        }).then((res) => {
            that.options = []
            for (let tag in res.data.data) {
                let option = {}
                option['value'] = get_tag_label(tag)
                option['label'] = get_tag_label(tag)
                option['children'] = []
                for (let child of res.data.data[tag]) {
                    let child_option = {}
                    child_option['value'] = child['id']
                    child_option['label'] = child['name']
                    option['children'].push(child_option)
                }
                that.options.push(option)
            }

        }).catch((error) => console.log(error))
    },
    watch: {
        is_switch: {
            handler(newValue) {
                if (newValue === true) {
                    this.$emit('get_bind_pins', this.bind_pins)
                }
                else if (newValue === false) {
                    this.value = []
                }
            },
            deep: true
        },
        bind_pins(newData) {
            // console.log(newData)
        }
    }

};
</script>

<style>

</style>