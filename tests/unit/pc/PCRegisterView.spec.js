import { mount } from '@vue/test-utils'
import PCRegisterView from '@/components/pc/PCRegisterView.vue'

// PCRegisterView测试
describe('PCRegisterView', () => {
    test('sends email code when email is valid', async () => {
        const wrapper = mount(PCRegisterView, {
            global: {
                mocks: {
                    
                }
            }
        });

        // 模拟用户输入有效的邮箱地址
        wrapper.setData({ registerForm: { email: 'test@example.com' } })

        // 等待异步代码执行完毕
        await wrapper.vm.startCountdown()

        // 检查是否发送了请求
        // expect(wrapper.vm.$axios.get).toHaveBeenCalledWith('/auth/email', {
        //     params: {
        //         email: 'test@example.com'
        //     }
        // });

        // // 检查是否显示了成功消息
        // expect(wrapper.vm.$message).toHaveBeenCalledWith({
        //     message: '验证码发送成功，请查收邮件',
        //     type: 'success'
        // });
    });

});
