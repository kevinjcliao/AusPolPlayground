# AUSGOV_PLAYGROUND
Just familiarizing myself with the APIs that the Open Australia Foundation provides for proliferating voter knowledge. 

To run this, you just need an additional Typescript file called keys.ts containing an API key from They Vote For You and the following: 
    export class keys {
        private theyvoteforyou: string = <YOUR API KEY HERE>;
        
        getTheyVoteForYou(): string {
         return this.theyvoteforyou;
        }
    }