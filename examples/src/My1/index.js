import My from './My';
import { JPG1, JPG2 } from './assets';

console.log('2222', JPG1, JPG2)

async function a() {
  await Promise.resolve(1);
  console.log('foo');
}

export default My;
