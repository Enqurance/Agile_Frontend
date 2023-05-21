import { mount } from '@vue/test-utils'
import PCRegisterView from '@/components/pc/PCRegisterView.vue'

// PCRegisterView测试
describe('PCRegisterView Email', () => {
    console.log("cwd is:" + process.cwd());
    it('sends email code when email is valid', async () => {
        const wrapper = mount(PCRegisterView, {
            global: {
                mocks: {
                },
            },
        });
    });
});