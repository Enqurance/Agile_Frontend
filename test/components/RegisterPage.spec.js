// ./src/components/hello-world/hello-world.spec.js

import { shallowMount } from "@vue/test-utils"
import RegisterPage from '../../src/components/RegisterPage.vue';

describe('<hello-world/>', () => {
    it('should render correct contents', () => {
    const wrapper = shallowMount(RegisterPage);
    expect(wrapper.find('.hello h1').text())
        .toEqual('Welcome to Your Vue.js App');
    });
});