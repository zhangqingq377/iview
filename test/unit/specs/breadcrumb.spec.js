import { createVue, destroyVM } from '../util';

describe('Breadcrumb.vue', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });
  it('create', done => {
    vm = createVue(`
      <Breadcrumb separator="<b class='demo-breadcrumb-separator'>=></b>">
        <Breadcrumb-item href="/">Home4</Breadcrumb-item>
        <Breadcrumb-item href="/components/breadcrumb">Components</Breadcrumb-item>
        <Breadcrumb-item>Breadcrumb</Breadcrumb-item>
      </Breadcrumb>
    `);
    expect(vm.$el.querySelectorAll('.kh-breadcrumb-item-link').length).to.equal(3);

    vm.$nextTick(_ => {
      // console.log(vm.$el.querySelector('.kh-breadcrumb-item-separator').innerHTML);
      expect(vm.$el.querySelector('.kh-breadcrumb-item-separator').innerHTML).to.equal('<b class="demo-breadcrumb-separator">=&gt;</b>');
      done();
    });
  });
});
