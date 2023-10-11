import './MentionLegale.scss';
function MentionLegale() {
  return (
    <div className="container1">
      <div className="comment">
        <h1>Mention Légales</h1>
        <section>
          <p>
            Disclaimer : Nous vous promettons que notre équipe a consommé des
            quantités raisonnables de café et de pizzas pour créer ce site.
            Cependant, en cas d'éventuelles fautes de frappe, de bugs inattendus
            ou de messages égarés par des extraterrestres, veuillez nous
            pardonner. Notre clavier a tendance à avoir un esprit propre, mais
            de temps en temps, il se rebelle et invente des mots. Si vous
            trouvez un pingouin tapant du code, ne soyez pas surpris, c'est
            notre mascotte. En fin de compte, nous faisons de notre mieux pour
            vous offrir une expérience agréable. Merci de votre compréhension et
            n'oubliez pas, même les licornes ont des jours off ! 🦄🚀
          </p>
        </section>
      </div>

      <div className="card-container">
        <article>
          <div className="circular-image">
            <img src="src\assets\cat.jpg" alt="Cat devLead" />
          </div>

          <h3>Cat Lead dev</h3>
          <p>Le Cat Lead dev C'est miaou </p>
        </article>
        <article>
          <div className="circular-image">
            <img src="src\assets\agrou.jpg" alt="Cat devLead" />
          </div>

          <h3>Scrum Master</h3>
          <p>Le Scrum Master C'est loulou </p>
        </article>
        <article>
          <div className="circular-image">
            <img src="src\assets\doggy.avif" alt="Git Master" />
          </div>

          <h3>Git Master</h3>
          <p>Le Git Master C'est moi </p>
        </article>
        <article>
          <div className="circular-image">
            <img src="src\assets\cat-side.jpg" alt="Référent Techno" />
          </div>

          <h3>Référent Techno</h3>
          <p>La Techno C'est cat</p>
        </article>
      </div>
    </div>
  );
}

export default MentionLegale;
