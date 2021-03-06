'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML),
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAutorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optAuthorsListSelector = '.authors.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  //    console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

const generateTitleLinks = function (customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};

generateTitleLinks();

const calculateTagsParams = function (tags) {
  const params = {
    min: 1000,
    max: 0,
  };
  for (let tag in tags) {
    params.min = Math.min(tags[tag], params.min);
    params.max = Math.max(tags[tag], params.max);
  }
  return params;
};

const calculateTagClass = function (count, params) {
  const countRange = params.max - params.min;
  let classRangeStep = countRange / optCloudClassCount;
  let classRangeMin = params.min;
  let classRangeMax = params.min + classRangeStep;
  for (let i = 1; i <= optCloudClassCount; i++) {
    if ((count >= classRangeMin) & (count <= classRangeMax)) {
      return optCloudClassPrefix + i;
    } else {
      // console.log(count);
      // console.log(classRangeMin);
      // console.log(classRangeMax);
      classRangeMin = classRangeMax;
      classRangeMax += classRangeStep;
    }
  }

  // sprawdzenie w ktorym przedziale jest aktualny tag
  // nadanie klasy z przedzialu klasy
};

const generateTags = function () {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const articleTagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to HTML variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    articleTagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */

  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    // allTagsHTML += `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag}</a><span> (${allTags[tag]})</span></li>`;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
};

const tagClickHandler = function (event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = clickedElement.innerText;
  // console.log(tag);
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let tag of activeTags) {
    /* remove class active */
    tag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagGroup = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tag of tagGroup) {
    /* add class active */
    tag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};

const addClickListenersToTags = function () {
  /* find all links to tags */
  const tags = document.querySelectorAll('.tags a');

  /* START LOOP: for each link */
  for (let tag of tags) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
};

generateTags();
addClickListenersToTags();

const generateAuthors = function () {
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const articleAutorsWrapper = article.querySelector(optArticleAutorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    const articleAuthorClass = articleAuthor.toLocaleLowerCase().replace(' ', '-');
    const linkHTMLData = {id: articleAuthorClass, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    /* add generated code to HTML variable */
    html = html + linkHTML;
    /* insert HTML of all the links into the tags wrapper */
    articleAutorsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
    if (!allAuthors[articleAuthor]) {
      /* [NEW] add tag to allTags object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }
  const authorList = document.querySelector(optAuthorsListSelector);
  const allAuthorsData = {authors: []};
  for (let author in allAuthors) {
    allAuthorsData.authors.push({
      author: author,
      authorLowerCase: author.toLowerCase().replace(' ', '-'),
    });
  }
  /* [NEW] END LOOP: for each tag in allTags: */
  authorList.innerHTML = templates.authorsListLink(allAuthorsData);
};

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = clickedElement.innerText;
  /* find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for (let author of activeAuthors) {
    /* remove class active */
    author.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const authorsGroup = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let author of authorsGroup) {
    /* add class active */
    author.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

const addClickListenersToAuthors = function () {
  /* find all links to tags */
  const authors = document.querySelectorAll(`.authors a`);
  /* START LOOP: for each link */
  for (let author of authors) {
    /* add tagClickHandler as event listener for that link */
    author.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each link */
};

generateAuthors();
addClickListenersToAuthors();
