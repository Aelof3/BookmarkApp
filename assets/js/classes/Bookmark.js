import BookmarkAPI from './BookmarkAPI.js';

export default class Bookmark {
    constructor( data ){
        this.id = data.id || '';
        this.title = data.title || '';
        this.rating = data.rating || 1;
        this.url = data.url || '';
        this.desc = data.desc || '';
        this.expanded = false;
        this.deleted = false;
        this.html = {};
        this.r = new BookmarkAPI( );

        this.init( );
    }

    init( ){
        this.templateHTML( );
    }

    send( evt,data ){
        window.dispatchEvent( new CustomEvent( evt, { detail: data } ) );
    }

    setRating( newRating ){
        this.rating = newRating;
    }   
    
    templateHTML( ){
        this.html.body = this.$(`<div class="section--row bookmark--item ${this.expanded ? 'section--expanded' : ''}"></div>`);
        this.html.title = this.$(`<div class="bookmark--title">${this.title}</div>`)
        this.html.rating = this.$(`<div class="bookmark--rating">
                                        ${this.templateRatings( )}
                                    </div>`);
        this.html.delete = this.$(`<div class="bookmark--delete hidden"></div>`);
        this.html.info = this.$(`<div class="section--column bookmark--info">
                                        <a href="${this.url}" target="_blank" class="bookmark--url hidden">Visit Site</a>
                                    </div>`);
        this.html.desc = this.$(`<textarea class="bookmark--description hidden">${this.desc}</textarea>`);
        this.html.info.appendChild( this.html.desc );
        this.html.body.appendChild( this.html.title );
        this.html.body.appendChild( this.html.delete );
        this.html.body.appendChild( this.html.info );
        this.html.body.appendChild( this.html.rating );
        
        this.html.rating.onclick = e => {
            if ( e.target.value >= 1 && e.target.value <= 5) this.r.patch(this.id,{ "rating": e.target.value } );
        }

        this.html.desc.onchange = e => {
            this.r.patch(this.id,{ "desc": this.html.desc.value } )
        }

        this.html.title.onclick = (e)=>{
            this.expanded = !this.expanded;
            this.html.body.classList.toggle("section--expanded");
            this.html.body.classList.toggle("section--row");
            this.html.body.classList.toggle("section--column");
            this.html.delete.classList.toggle("hidden");
            this.html.info.childNodes[1].classList.toggle("hidden");
            this.html.info.childNodes[3].classList.toggle("hidden");
            this.html.rating.classList.toggle("hidden");
        }

        this.html.delete.onclick = (e)=>{
            this.r.delete( this.id );
        };

    }

    templateRatings( ){
        
        return `<input type="radio" name="rating-${this.id}" value="1" class="rating--star" ${(this.rating === 1) ? 'checked="checked"':''}></input>
                <input type="radio" name="rating-${this.id}" value="2" class="rating--star" ${(this.rating === 2) ? 'checked="checked"':''}></input>
                <input type="radio" name="rating-${this.id}" value="3" class="rating--star" ${(this.rating === 3) ? 'checked="checked"':''}></input>
                <input type="radio" name="rating-${this.id}" value="4" class="rating--star" ${(this.rating === 4) ? 'checked="checked"':''}></input>
                <input type="radio" name="rating-${this.id}" value="5" class="rating--star" ${(this.rating === 5) ? 'checked="checked"':''}></input>`;
    }

    $( txt ){
        let t = document.createElement( "template" );
        txt = txt.trim();
        t.innerHTML = txt;
        return t.content.firstChild;
    }
}