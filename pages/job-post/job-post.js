import addButton from "../../blocks/button/button.js";
import {
    $addMiddleElm,
    $element,
} from "../../scripts/helpers.js";
import { getJobsFragment } from "../../scripts/jobs-fragments.js";
import makeSimilarOpportunitiesBlock from "../../blocks/job-posting-blocks/similar-opportunities.js";

/**
 * @param {HTMLElement} $page
 */
export default async function decorate($page) {
    /* Add classes and ids to container elements */
    let body_job_post = document.querySelector("body");
    body_job_post.classList.add("job-post");
    document.querySelector("#global-header").classList.add("split");
    document.querySelector("div#global-background").remove();
    let postContainer  = document.querySelector("main > div.section-wrapper");
    postContainer.classList.add("post-container");
    let postText = document.querySelector(".post-container > div");
    postText.classList.add("post-text");

    let stickyContainer = $element("div.sticky-container")
    postContainer.prepend(stickyContainer)


    $addMiddleElm(
        document.querySelector("div.section-wrapper"),
        ".post-container",
        document.querySelector(".post-text")
    )

    // $addMiddleElm(
    //     document.querySelector(".post-container"),
    //     "div.inner_post_contnr",
    //     document.querySelector(".post-text")
    // )


    /* Assemble "Equal Opportunities" + "About Adobe Design" blocks */
    buildJobBlockFragments();
    /* Assemble "Similar Opportunities" block */
    buildSimOpportunitiesBlock();
    document.querySelector("main").append($element("div.similarOpps-block"));



}

async function buildSimOpportunitiesBlock(){
    let simOppsContent = await makeSimilarOpportunitiesBlock('nothing');
    if(simOppsContent) {
        document.querySelector("div.similarOpps-block").append(simOppsContent)
    } else {
        console.log(`Cannot fetch similar opportunities to build the block`)
    }
}

async function buildJobBlockFragments() {
    const aboutURL = 'about-adobe-design';
    const eopsURL = 'equal-opportunity-policy-stmnt';

    /* ----- About Adobe Design Element -----    */
    /** Get "About Adobe Design" Fragment: */
    const aboutInnerHTML = await getJobsFragment(aboutURL);
    if(aboutInnerHTML){
        let aboutElm = $element('div.about-adobe-design')
        aboutElm.innerHTML = aboutInnerHTML;
        document.querySelector("main").append(aboutElm)
    } else {
        console.log(`Cannot fetch ${aboutURL} fragment or fragment doesn't exist`)
    };

    /* ------ Equal Opportunities Policy ------- */
    /** Get "Equal Opportunity Policy" Fragment: */
    const eopsInnerHtml    = await getJobsFragment(eopsURL);

    if(eopsInnerHtml) {
        let eqOpPolicy = $element('div.eq-op-policy-stmnt');
        eqOpPolicy.innerHTML = eopsInnerHtml;
        document.querySelector("main").append(eqOpPolicy);
    } else {
        console.log(`Cannot fetch ${eopsURL} fragment or fragment doesn't exist`)
    };
}