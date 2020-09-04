<template>
  <div id="lossRecoveryCalculatorContainer">
    <h1>Loss recovery calculator</h1>
    <div class="calculatorBody">
      <div class="inputGroup">
        <label for>Buy Price</label>
        <input
          type="number"
          min="0"
          v-model="buyPrice"
          v-on:change="dataUpdate()"
          v-on:keyup="dataUpdate()"
        />
      </div>

      <div class="inputGroup">
        <label for>Units Brought</label>
        <input
          type="number"
          min="0"
          v-model="units"
          v-on:change="dataUpdate()"
          v-on:keyup="dataUpdate()"
        />
      </div>

      <div class="inputGroup twoColumns">
        <div>
          <label for>Current Price</label>
          <input
            type="number"
            min="0"
            v-model="currentPrice"
            v-on:change="dataUpdate()"
            v-on:keyup="dataUpdate()"
          />
        </div>
        <div class="center">
          <span v-if="this.loss>-1">Current Loss {{this.loss}}%</span>
        </div>
      </div>

      <div class="inputGroup twoColumns">
        <div>
          <label for>Expected to increase (%)</label>
          <input
            ref="expected"
            type="number"
            min="0"
            v-model="increase"
            v-on:change="dataUpdate()"
            v-on:keyup="dataUpdate()"
            placeholder="e.g. 1%"
          />
        </div>
        <div class="center">
          <span v-if="this.increase > 0">{{result.afterIncreasePrice}} rs per unit</span>
        </div>
      </div>
      <div class="result">
        <span v-if="loss<0">You are in profit</span>
        <span
          v-if="result.reinvest<=0"
        >After {{increase}}% form current price per unit cost will be {{result.afterIncreasePrice}} rs, you will recover your money</span>
        <table
          :style="[increase<=0 || loss<0  ||  result.reinvest<=0?{'visibility':'hidden'}:{'visibility':'unset'}]"
        >
                  <tr>
            <td>Current Loss</td>
            <td>=</td>
            <td>{{loss}}%</td>
          </tr>
          <tr>
            <td>( Old ) investment</td>
            <td>=</td>
            <td>{{invested}}</td>
          </tr>
          <tr>
            <td>After {{increase}}% increase from current price</td>
            <td>=</td>
            <td>{{(result.afterIncreasePrice)}} rs per unit</td>
          </tr>

          <tr>
            <td>(New) Reinvestment</td>
            <td>=</td>
            <td>{{(result.reinvest)}} rs to buy new {{result.newUnits}} units</td>
          </tr>
          <tr>
            <td>After investing you will have</td>
            <td>=</td>
            <td>{{((result.totalUnits))}} units</td>
          </tr>

          <tr>
            <td>Total Investment</td>
            <td>=</td>
            <td>{{(result.totalInvestemet)}} (old + new)</td>
          </tr>
          <tr>
            <td>Total returns</td>
            <td>=</td>
            <td>{{(result.totalReturns)}}</td>
          </tr>
        </table>
      </div>
    </div>
    <section>
      <h1>How Loss Recovery Calculator Works?</h1>
      <div class="flex-center">
        <p>
          The main concept here is when you buy something at two different price the avarage of two price becomes the actual price.
          The only reason you have loss because the assets you have brought in high price and now the price came down, so if you buy more now at low price then the avarage price will go down.
        </p>
      </div>
    </section>
    <section>
      <h1>How to use Loss Recovery Calculator?</h1>
      <div class="flex-center">
        <p>
          Enter the fields given and try to predict (Expected to increase field)  
          how much it can go high from the current price, start form 1% (or less)  
          and see the after increase what will be each unit price, 
           the results bellow will be shown how much new units you have to buy to rcover your total money.
          <a href="https://prnysarker.github.io/kiteman">Download Kiteman to get one click result </a>  
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LossRecoveryCalculatorComponent",
  data: function () {
    return {
      loss: 0,
      buyPrice: 100,
      units: 5,
      currentPrice: 80,
      invested: 0,
      increase: "",
      result: {},
    };
  },
  mounted: function () {
    this.params = this.$route.query;
    if (this.params.buy) {
      this.buyPrice = parseFloat(this.params.buy);
    }
    if (this.params.units) {
      this.units = parseFloat(this.params.units);
    }
    if (this.params.cprice) {
      this.currentPrice = parseFloat(this.params.cprice);
    }

    this.$refs.expected.focus();
    this.dataUpdate();
  },

  methods: {
    dataUpdate: function () {
      if (this.buyPrice > 0 && this.currentPrice > 0 && this.units > 0) {
        this.loss = ((this.buyPrice - this.currentPrice) / this.buyPrice) * 100;
        this.loss = Math.ceil(this.loss * 1000) / 1000;
        this.invested = Math.ceil(this.buyPrice * this.units * 1000) / 1000;

        if (this.increase > 0) {
          this.temp = this.lossBalance(
            parseFloat(this.units),
            parseFloat(this.invested),
            parseFloat(this.loss),
            parseFloat(this.increase),
            parseFloat(this.currentPrice)
          );
          this.result = this.cleanResult(this.temp, this.invested);
        } else {
          this.increase = "";
        }
      }
    },

    lossBalance: function (
      unitBrought,
      investedAmount,
      currentLoss,
      expectedUp,
      currentPrice
    ) {
      let result = {};
      let lossToRecover = investedAmount * (currentLoss / 100);
      let currentEachUnitPrice = currentPrice;

      let expectedUpPerc = expectedUp / 100;
      let amountToBeInvestedAgain =
        lossToRecover * (1 / expectedUpPerc) - (investedAmount - lossToRecover);

      result.reinvest = amountToBeInvestedAgain;
      let newUnitsToBeBraught = amountToBeInvestedAgain / currentEachUnitPrice;
      result.newUnits = newUnitsToBeBraught;

      let afterIncreaseEachUnitPrice =
        currentEachUnitPrice * expectedUpPerc + currentEachUnitPrice;

      result.afterIncreasePrice = afterIncreaseEachUnitPrice;
      result.totalUnits = newUnitsToBeBraught + unitBrought;
      result.totalReturns =
        (newUnitsToBeBraught + unitBrought) * afterIncreaseEachUnitPrice;

      return result;
    },
    cleanResult: function (result, invested) {
      /**
       * afterIncreasePrice: 2151.6389999999997
newUnits: 0.04697297210173273
reinvest: 99.0871360000001
totalReturns: 2252.70787872
totalUnits: 1.0469729721017327
       */
      result.afterIncreasePrice = this.roundToTwo(result.afterIncreasePrice);
      result.newUnits = this.roundToTwo(result.newUnits);
      result.reinvest = this.roundToTwo(result.reinvest);
      result.totalReturns = this.roundToTwo(result.totalReturns);
      result.totalUnits = this.roundToTwo(result.totalUnits);
      result.totalInvestemet = this.roundToTwo(result.reinvest + invested);
      return result;
    },

    roundToTwo: function (num) {
      return +(Math.round(num + "e+2") + "e-2");
    },
  },
};
</script>


<style scoped>
#lossRecoveryCalculatorContainer {
}

h1 {
  text-align: center;
      color: #f6542b;
}

.calculatorBody {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 14px 0px #e6e6e6;
  border: 1px solid #cdcdcd;
  width: 500px;
  max-width: 90vw;
  margin: auto;
}

.inputGroup {
  display: grid;

  padding: 10px;
}

.inputGroup.twoColumns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}

input[type="number"] {
    padding: 8px 10px;
    border: 1px solid #bbb;
    border-radius: 2px;
    margin-top: 2px;
}

tr:nth-child(2n) {
  background: #fefefe;
}

tr:nth-child(2n + 1) {
  background: #f0f0f0;
}
table {
  border-spacing: unset;
  border: 1px solid #cbcbcb;
  border-radius: 4px;
  overflow: hidden;
  width: 98%;
  margin: auto;
}

td {
  padding: 5px 10px;
  height: 40px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 2px;
  font-size: 1.4rem;
  text-align: center;
}

section {
  max-width: 80vw;
  margin: auto;
  padding-top: 50px;
}
.flex-center {
  display: flex;
  justify-content: center;
}
section  h1{
  margin: 0;
}
</style>