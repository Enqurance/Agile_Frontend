import { mount } from '@vue/test-utils'
import RegisterPage from '@/components/RegisterPage.vue'
import PCRegisterView from '@/components/pc/PCRegisterView.vue'

// RegisterPage渲染测试
describe('RegisterPage', () => {
    // 使用设备为pc，PCRegisterView渲染测试
    test('renders PCRegisterPage component when device is pc', () => {
        // 使用mocks选项模拟this.$device属性的值
        const wrapper = mount(RegisterPage, {
            global: {
                mocks: {
                    $device: 'pc'
                }
            }
        })
        expect(wrapper.findComponent(PCRegisterView).exists()).toBe(true)
    })

    // 使用设备为pc，PCRegisterView渲染测试
    test('does not render PCRegisterPage component when device is not pc', () => {
        const wrapper = mount(RegisterPage, {
            global: {
                mocks: {
                    $device: 'iPhone'
                }
            }
        })
        expect(wrapper.findComponent(PCRegisterView).exists()).toBe(false)
    })
})
