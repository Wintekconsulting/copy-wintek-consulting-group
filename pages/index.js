import React, { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Avancemos from '../components/AvancemosSection/Avancemos';
import Transformando from '../components/TransformaSection/Transformando';
import Adn from '../components/AdnSection/AdnSection'
import Solicita from '../components/SolicitaSection/Solicita';
import BannerSection from '../components/Banner/BannerSection';

const HomePage = () => {
    const router = useRouter();
    const { section } = router.query;

    useEffect(() => {
        if (section) {
            console.log(section)
            const { offsetTop } = document.querySelector('#' + section);
            window.scrollTo({ top: offsetTop - 80, behavior: 'smooth' });
        }
    }, [section])

    return (
        <Fragment>
            <BannerSection/>
            <Transformando/>
            <Adn/>
            <Avancemos/>
            <Solicita/>
        </Fragment>
    )
};

export default HomePage;
