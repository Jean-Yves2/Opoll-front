import './Apropos.scss';
function Apropos() {
  return (
    <div className="container-page">
      <div className="description">
        <h1>A PROPOS</h1>
        <section>
          <p>

           Bienvenue sur notre page À Propos ! <br/><br/>Nous sommes une équipe de 4 développeurs web 
           passionnés par la création de solutions numériques innovantes et efficaces.<br/><br/>
           Permettez-nous de vous présenter brièvement. Notre aventure a commencé
           il y a quelques mois, lorsque nous étions apprenant chez O'clock.
           Passionnés par la technologie et le web, nous sommes rapidement rendus 
           compte que nous avions une vision commune : <br/><br/>Créer des expériences en ligne
           exceptionnelles et donner vie aux idées innovantes de nos clients.<br/><br/>
           Après avoir collaboré sur plusieurs projets, nous avons décidé de créer
           notre propre site en ligne, mettant ainsi en commun nos compétences et notre expertise.

          </p>
        </section>
      </div>
      <div className="cover">
        <img src="./Apropos.jpg" alt="Photo de Statistic" />
      </div>
    </div>
  );
}
export default Apropos;
