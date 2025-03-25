import Button from '@shared/ui/Button';
import Card from '@shared/ui/Card';

function App() {
  return (
    <Card
      captionSlot={'test'}
      title={'test'}
      subtitle={'test'}
      image={'https://avatars.githubusercontent.com/u/45487711?s=280&v=4'}
      contentSlot={'test'}
      actionSlot={<Button>test</Button>}
    />
  );
}

export default App;
