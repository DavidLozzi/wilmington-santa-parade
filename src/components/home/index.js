import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Map from '../map';
import SantaImage from '../santaImage';
import Menu from '../menu';

import './index.css';
import { Analytics } from '../../analytics';

function Home({ Page }) {
  const navigate = useNavigate()
  const [ModalComponent, setModalComponent] = useState(Page)

  const closeModal = () => {
    setModalComponent(null)
    navigate('/')
    Analytics.record({ name: 'Close Modal'})
  }

  useEffect(() => {
    setModalComponent(Page)
  }, [Page])
  return (
    <>
    {ModalComponent && <div id="modalwrapper"><div id="modal">
      <button title="close modal" onClick={closeModal} id="close">X</button>
    {ModalComponent}
    </div></div>}
    <SantaImage />
    <Menu />
    <Map />
   </>
  );
}

export default Home;
