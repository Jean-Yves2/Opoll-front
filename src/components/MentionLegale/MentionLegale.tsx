import './MentionLegale.scss';
function MentionLegale() {
  return (
    <div className="container1">
      <div className="comment">
        <h1>Mention Légales</h1>
        <section>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente
          dolor cum quam, fugit animi maiores exercitationem impedit, neque
          accusantium optio, odit quas nihil! Tempora sed tempore in animi quae
          repellat.Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Sapiente dolor cum quam, fugit animi maiores exercitationem impedit,
          neque accusantium optio, odit quas nihil! Tempora sed tempore in animi
          quae repellat.Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Sapiente dolor cum quam, fugit animi maiores exercitationem
          impedit, neque accusantium optio, odit quas nihil! Tempora sed tempore
          in animi quae repellat.Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Sapiente dolor cum quam, fugit animi maiores
          exercitationem impedit, neque accusantium optio, odit quas nihil!
          Tempora sed tempore in animi quae repellat.
        </section>
      </div>

      <div className="card-container">
        <article>
          <div className="circular-image">
            <img src="src\assets\cat.jpg" alt="Cat devLead" />
          </div>

          <h3>
          Cat Lead dev
          </h3>
          <p>Le Cat Lead dev C'est miaou </p>
        </article>
        <article>
          <div className="circular-image">
            <img src="src\assets\agrou.jpg" alt="Cat devLead" />
          </div>

          <h3>
            Scrum Master
          </h3>
          <p>Le Scrum Master C'est loulou </p>
        </article>
        <article>
          <div className="circular-image">
            <img src="src\assets\doggy.avif" alt="Git Master" />
          </div>

          <h3>
           Git Master
          </h3>
          <p>Le Git Master C'est moi </p>
        </article>
        <article>
          <div className="circular-image">
            <img src="src\assets\cat-side.jpg" alt="Référent Techno" />
          </div>

          <h3>
            Référent Techno
          </h3>
          <p>La Techno C'est cat</p>
        </article>
      </div>
    </div>
  );
}

export default MentionLegale;
