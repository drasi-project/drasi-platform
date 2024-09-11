const yaml = import('js-yaml');
const { expect }  = import('chai');


let signalrFixture = new SignalrFixture(["building-comfort-level-calc","floor-comfort-level-calc", "room-comfort-level-calc"]);


before(async function () {
  this.timeout(120000);
  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deployResources(resources);

  await signalrFixture.start();
  // todo
  await new Promise(r => setTimeout(r, 15000)); // reactivator is slow to startup
});

it('Initial floor data', async function () {
  let initData = await signalrFixture.requestReload("floor-comfort-level-calc");

  expect(initData.length == 3).toBeTruthy();
});

it('Initial room data', async function () {
  let initData = await signalrFixture.requestReload("room-comfort-level-calc");

  expect(initData.length == 9).toBeTruthy();
}); 

it('Initial building data', async function () {
  let initData = await signalrFixture.requestReload("building-comfort-level-calc");

  expect(initData.length == 1).toBeTruthy();
});


after(
  async () => {
    await signalrFixture.stop();

  }
);