// tests/components/Counter.spec.js
import { mount } from "@vue/test-utils";
import Counter from "./Counter.vue";

describe("Counter.vue", () => {
    it("renders count value and buttons", () => {
        const wrapper = mount(Counter);
        expect(wrapper.find("span").text()).toBe("0");
        expect(wrapper.findAll("button").length).toBe(2);
    });

    it("increments the count value when + button is clicked", async () => {
        const wrapper = mount(Counter);
        const incrementButton = wrapper.find("button:nth-child(1)");

        await incrementButton.trigger("click");
        expect(wrapper.find("span").text()).toBe("1");
    });

    it("decrements the count value when - button is clicked", async () => {
        const wrapper = mount(Counter);
        const decrementButton = wrapper.find("button:nth-child(3)");

        await decrementButton.trigger("click");
        expect(wrapper.find("span").text()).toBe("-1");
    });
});