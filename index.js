const TreasureGen = {
    template: `
        <div class="treasure-gen">
            <div class="input-lvl">
                <select v-model="lvl" @change="generateTreasure()">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option>
                </select>
            </div>
            <button @click="generateTreasure()">Generate</button>
            <div class="output-treasure">
                <ol>
                    <li v-for="item in treasure" :key="item.Name"><a :href="item.Url">{{ item.Name }}</a></li>
                </ol>
            </div>
        </div>
    `,
    data() {
        return {
            allEquipment: [],
            treasureByEnc: [],
            treasure: [],
            lvl: 2,
        }
    },
    async mounted() {
        if (localStorage.lvl) this.lvl = localStorage.lvl;
        // if (localStorage.seed) this.seed = localStorage.seed;

        let allEquipment = await this.getCsv('equipment2', true);
        console.log(allEquipment[0]);
        this.allEquipment = allEquipment;

        let treasureByEnc = await this.getCsv('treasure_by_encounter', true);
        console.log(treasureByEnc[0]);
        this.treasureByEnc = treasureByEnc;

        this.generateTreasure(this.lvl, 'Moderate');
    },
    methods: {
        generateTreasure() {
            localStorage.lvl = this.lvl;

            let threat = 'Moderate'

            // How much gp are the treasures worth
            let maxGpStr = this.treasureByEnc[this.lvl - 1][threat].match('[^ ]+')[0];
            maxGpStr = maxGpStr.replace(',', '')
            const maxGp = parseFloat(maxGpStr);

            // What level range are we looking at
            const minLvl = Math.max(this.lvl - 3, 1);    // Ignore lvl 0 stuff
            const maxLvl = Math.min(this.lvl + 1, 20);
            let lvlEquip = this.allEquipment.filter(e => e.Level >= minLvl && e.Level <= maxLvl);

            let treasure = [];
            let gp = 0;
            for (let i = 0; i < 10; i++) {
                // Get random item and its price
                let index = Math.floor(Math.random() * lvlEquip.length)
                let item = lvlEquip[index];
                let price = parseFloat(item.Price);

                // Have room for the item?
                if (gp + price < maxGp * 1.1) {
                    treasure.push(item);
                    gp += price;
                }

                if (gp >= maxGp * 0.9) break;
            }

            this.treasure = treasure;
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
        }
    }
}


const app = Vue.createApp({});
app.component('treasure-gen', TreasureGen);
app.mount('#app-main');