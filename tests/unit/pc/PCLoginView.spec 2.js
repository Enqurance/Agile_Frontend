import { mount } from '@vue/test-utils'
import PCLoginView from '@/components/pc/PCLoginView.vue'
import router from '@/router'
import axios from "@/axios/axios.js"

// PCRegisterView测试
describe('PCLoginView', () => {
    test('login verify test', async () => {
        const wrapper = mount(PCLoginView, {
            global: {
                mocks: {
                    $router: router,
                    $axios: axios
                }
            }
        });

        // 等待异步代码执行完毕
        await wrapper.vm.goToRegister()
        await wrapper.vm.closeVerified()
    });
});
