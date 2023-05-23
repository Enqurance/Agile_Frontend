import { mount } from '@vue/test-utils'
import MapPinAdd from "@/components/pc/sub_components/mappage_sub_components/MapPinAdd.vue"

// RegisterPage渲染测试
describe('MapPinAdd Basic', () => {

    // 使用设备为pc，PCRegisterView渲染测试
    test('MapPinAdd basic', () => {
        // 使用mocks选项模拟this.$device属性的值
        const wrapper = mount(MapPinAdd, {
            propsData: {
                title: 'title',
                showIcon: true
            }
        })
    })
})
