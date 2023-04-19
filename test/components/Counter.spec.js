// tests/components/Counter.spec.js
import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";
import ElementPlus, {ElButton} from 'element-plus';
import 'element-plus/theme-chalk/index.css';

jest.mock('element-plus/theme-chalk/index.css', () => ({
    __esModule: true,
    default: '',
}));

describe("Counter.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Counter, {
            global: {
                plugins: [ElementPlus],
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('test', async () => {
        const button = wrapper.find('[testid="123"]');
        expect(button.exists()).toBe(true);
    });

});