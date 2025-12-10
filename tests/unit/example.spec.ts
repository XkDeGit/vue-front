import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import { i18n } from '@/locales/i18n';

describe('HomeView', () => {
  it('renders welcome copy', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n]
      }
    });

    expect(wrapper.text()).toContain('Manage subscriptions');
  });
});
