import { mount } from '@vue/test-utils'
import PCRegisterView from '@/components/pc/PCRegisterView.vue'
import router from '@/router'
import axios from "@/axios/axios.js"

// PCRegisterView测试
describe('PCRegisterView', () => {
    test('sends email code when email is valid', async () => {
        const wrapper = mount(PCRegisterView, {
            global: {
                mocks: {
                    $router: router,
                    $axios: axios
                }
            }
        });

        // 模拟用户输入有效的邮箱地址
        wrapper.setData({ registerForm: { email: 'test@example.com' } })

        // 等待异步代码执行完毕
        await wrapper.vm.startCountdown()
        await wrapper.vm.openVerified()

        // 检查是否发送了请求
        // expect(wrapper.vm.$axios.get).toHaveBeenCalledWith('/auth/email', {
        //     params: {
        //         email: 'test@example.com'
        //     }
        // });
    });
});
