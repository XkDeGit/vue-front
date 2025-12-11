import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import type { Plan } from '@/api/types';
import { i18n } from '@/locales/i18n';
import PlansView from '@/views/PlansView.vue';

const useQueryMock = vi.fn();

vi.mock('@tanstack/vue-query', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args)
}));

const basePlans: Plan[] = [
  { id: 'starter', name: 'Starter', price: 29, currency: '$', interval: 'month', status: 'active' }
];

const mountPlansView = () =>
  mount(PlansView, {
    global: {
      plugins: [i18n],
      stubs: {
        ElCard: { template: '<section class="el-card-stub"><slot /></section>' },
        ElButton: { template: '<button class="el-button-stub"><slot /></button>' },
        ElTable: {
          props: {
            data: {
              type: Array,
              default: () => []
            }
          },
          template:
            '<div class="el-table-stub"><slot v-for="row in data" :row="row" :key="row.id" /></div>'
        },
        ElTableColumn: { template: '<div class="el-table-column-stub"><slot /></div>' }
      }
    }
  });

beforeEach(() => {
  useQueryMock.mockReset();
  useQueryMock.mockReturnValue({
    data: ref(basePlans),
    isError: false
  });
});

describe('PlansView', () => {
  it('renders plans header and CTA copy', () => {
    const wrapper = mountPlansView();

    expect(wrapper.find('h2').text()).toBe('Plans');
    expect(wrapper.text()).toContain('Create a plan');
    expect(wrapper.text()).toContain('$ 29 / month');
  });

  it('shows an error message when fetching plans fails', () => {
    useQueryMock.mockReturnValue({
      data: ref<Plan[] | undefined>(undefined),
      isError: true
    });

    const wrapper = mountPlansView();

    expect(wrapper.text()).toContain('Failed to load plans');
  });
});
