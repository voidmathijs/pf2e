const TreasureGen = {
    template: `
        <div class="treasure-gen">
            <div class="input-lvl">
                <!--<input type="number" min="1" max="20" />-->
                <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <button @click="generateTreasure(2, 'Moderate')">Generate</button>
            <div class="output-treasure">{{ treasure }}</div>
        </div>
    `,
    data() {
        return {
            allEquipment: [],
            treasureByEnc: [],
            treasure: ''
        }
    },
    async mounted() {
        await this.init();
    },
    methods: {
        async init() {
            let allEquipment = await this.getCsv('equipment', true);
            console.log(allEquipment[0]);
            this.allEquipment = allEquipment;

            let treasureByEnc = await this.getCsv('treasure_by_encounter', true);
            console.log(treasureByEnc[0]);
            this.treasureByEnc = treasureByEnc;
        },

        generateTreasure(lvl, threat) {
            this.treasure = this.treasureByEnc[lvl - 1][threat];
        },

        async getCsv(filename, hasHeader) {
            return new Promise((resolve, reject) => {
                Papa.parse(`data/${filename}.csv`, {
                    header: hasHeader,
                    download: true,
                    complete: function (results) {
                        resolve(results.data);
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        },

        /**
         * Returns an array of randomly selected cards.
         * Warning: has side effect of shuffling the cards array.
         */
        shuffleAndSelectRandom(cards = [], count = 10) {
            if (count > cards.length) throw 'Not enough cards to randomly select';
            if (count == cards.length) return cards.slice();

            // Select 'count' random cards by shuffling the first 'count' cards.
            for (let i = 0; i < count; i++) {
                let rnd = i + Math.floor(Math.random() * (cards.length - i));
                [cards[rnd], cards[i]] = [cards[i], cards[rnd]];
            }

            return cards.slice(0, count);
        },
    }
}


const app = Vue.createApp({});
app.component('treasure-gen', TreasureGen);
app.mount('#app-main');