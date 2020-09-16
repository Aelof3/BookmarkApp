import Bookmark from './Bookmark.js';
import BookmarkAPI from './BookmarkAPI.js';

export default class BookmarkApp {
    constructor( data ){
        this.r = new BookmarkAPI( );

        this.bookmarks = null;
        this.adding = data.adding || false;
        this.error = data.error || null;
        this.filter = data.filter || 0;

        this.html = {};
        this.currentPage = "main"; // add
        this.init( );
    }

    init( ){
        this.el = document.createElement("main");
        this.el.setAttribute("id","bookmark--app");
        document.body.appendChild( this.el );
        this.templates( );
        this.setupEventHandlers( );
        this.r.get();
    }

    setupEventHandlers( ){
        window.addEventListener( "renderMainPage", ( e )=>{
            this.renderMainPage( );
        }, false );
        
        window.addEventListener( "getRequestResult", ( e )=>{
            this.currentPage = "main";
            this.bookmarks = e.detail.map( b => new Bookmark(b) )
            this.render( );
        }, false );

        window.addEventListener( "postRequestResult", ( e )=>{
            this.r.get();
        }, false );

        window.addEventListener( "patchRequestResult", ( e )=>{
            this.r.get();
        }, false );

        window.addEventListener( "deleteRequestResult", ( e )=>{
            this.r.get();
        }, false );
    }

    send( evt,data ){
        window.dispatchEvent( new CustomEvent( evt, { detail: data } ) );
    }
    
    addBookmark( bookmark ){
        // add new bookmark
        this.bookmarks.push( bookmark );
    }

    templates( page ){
        // build the html
        this.html.body = this.$(`<div class="section--column"></div>`);
        this.html.title = this.$(`<div class="section--row"><h1>My Bookmarks</h1></div>`);
        this.html.buttons = this.$(`<div id="buttonsection" class="section--row"></div>`);
        this.html.newBookmark = this.$(`<button class="drawn--box" id="newbookmark">New</button>`);
        this.html.filter = this.$(`<select id="filter" placeholder="Filter By" class="drawn--box" name="filter">
                                    <option value="" disabled selected hidden>Filter By</option>
                                    <option value="1">1+ star</option>
                                    <option value="2">2+ stars</option>
                                    <option value="3">3+ stars</option>
                                    <option value="4">4+ stars</option>
                                    <option value="5">5 stars</option>
                                </select>`);

        this.html.bookmarks = this.$(`<div id="bookmark--list"></div>`);

        this.html.body.appendChild( this.html.title );
        
        this.html.buttons.appendChild( this.html.newBookmark );
        this.html.buttons.appendChild( this.html.filter );

        this.html.body.appendChild( this.html.buttons );
        this.html.body.appendChild( this.html.bookmarks );

        // add bookmark form
        this.html.form = this.$(`<form id="addnewbookmark" class="section--column">
                                        <h1>My Bookmarks</h1>
                                        <label for="url">Add New Bookmark:</label>
                                        <input placeholder="https://yourbookmark.here/" type="url" name="url" id="url" required></input>
                                        <input placeholder="Bookmark Title" type="text" name="title" id="title" required></input>
                                    </form>`);

        this.html.formratings = this.$(`<div id="formratingrow" class="section--row">
                                            <input type="radio" name="rating" value="1" class="rating--star" checked="checked"></input>
                                            <input type="radio" name="rating" value="2" class="rating--star"></input>
                                            <input type="radio" name="rating" value="3" class="rating--star"></input>
                                            <input type="radio" name="rating" value="4" class="rating--star"></input>
                                            <input type="radio" name="rating" value="5" class="rating--star"></input>
                                        </div>`);
        this.html.formdesc = this.$(`<textarea placeholder="Add a description (optional)" name="description" id="description"></textarea>`);
        this.html.formbuttons = this.$(`<div id="formbuttons" class="section--row"></div>`);
        this.html.formcancel = this.$(`<button class="button--rectangle" id="cancelbutton">Cancel</button>`);
        this.html.formcreate = this.$(`<button type="submit" class="button--rectangle" id="createbutton">Create</button>`);

        this.html.formbuttons.appendChild( this.html.formcancel )
        this.html.formbuttons.appendChild( this.html.formcreate )

        this.html.form.appendChild( this.html.formratings );
        this.html.form.appendChild( this.html.formdesc );
        this.html.form.appendChild( this.html.formbuttons );

        this.setupTemplateEventHandlers( );
    }

    setupTemplateEventHandlers( ){

        this.html.filter.onchange = e => {
            this.filter = this.html.filter.value;
            this.render();
        }

        this.html.formcancel.onclick = e => {
            this.currentPage = "main";
            this.render( );
        }

        this.html.newBookmark.onclick = e => {
            this.currentPage = "add";
            this.render( );
        }

        this.html.form.onsubmit = (e)=>{
            e.preventDefault();
            let formData = new FormData( e.target );
            let url = formData.get("url")
            let title = formData.get("title")
            let desc = formData.get("description")
            let rating = formData.get("rating");

            this.r.post({ "title": title, "url": url, "desc":desc, "rating":rating });
        }
    }

    renderAddNewPage( ){
        // render the add new bookmark page
        this.el.innerHTML = '';
        this.el.appendChild( this.html.form );
    }

    renderMainPage( ){
        // render the html of the page
        this.el.innerHTML = '';
        this.html.bookmarks.innerHTML = '';

        this.el.appendChild( this.html.body );

        this.bookmarks.forEach( b => ( b.rating >= this.filter ) ? this.html.bookmarks.appendChild( b.html.body ) : false );
    }

    render( ){
        if ( this.currentPage === "main" ) this.renderMainPage( );
        if ( this.currentPage === "add" ) this.renderAddNewPage( );
    }


    $( txt ){
        let t = document.createElement( "template" );
        txt = txt.trim();
        t.innerHTML = txt;
        return t.content.firstChild;
    }
}


/*                TITLE
* --------------------------------
* | new bookmark link            |
* --------------------------------
* | new bookmark name            |
* --------------------------------
* | new bookmark rating          |
* --------------------------------
* | description                  |
* |                              |
* |                              |
* |                              |
* |                              |
* --------------------------------
*/



// main page
/*                TITLE
* --------------------------------
* |NewBookmarkButton | filterList|
* --------------------------------
* | bookmark1       * * * * *    |
* --------------------------------
* | bookmark2       * * * * *    |
* --------------------------------
* | bookmark3       * * * * *    |
* --------------------------------
* | bookmark4       * * * * *    |
* --------------------------------
*/