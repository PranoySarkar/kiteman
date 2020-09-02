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

      <div class="inputGroup">
        <label for>Current Price</label>
        <input
          type="number"
          min="0"
          v-model="currentPrice"
          v-on:change="dataUpdate()"
          v-on:keyup="dataUpdate()"
        />
      </div>

      <div class="inputGroup">
        <label for>Expected to increase (%)</label>
        <input
          ref="expected"
          type="number"
          min="0"
          v-model="increase"
          v-on:change="dataUpdate()"
          v-on:keyup="dataUpdate()"
          placeholder="Expectected to increase"
        />
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
            <td>After {{increase}}% Increase</td>
            <td>{{(result.afterIncreasePrice)}} rs per unit price</td>
          </tr>
          <tr>
            <td>Current Loss</td>
            <td>{{loss}}%</td>
          </tr>
          <tr>
            <td>Old investment</td>
            <td>{{invested}}</td>
          </tr>
          <tr>
            <td>Need to reinvest (new)</td>
            <td>{{(result.reinvest)}} rs to buy new {{result.newUnits}} units</td>
          </tr>
          <tr>
            <td>After investing you will have</td>
            <td>{{((result.totalUnits))}} units</td>
          </tr>

          <tr>
            <td>Total Investment</td>
            <td>{{(result.totalInvestemet)}} (old + new)</td>
          </tr>
          <tr>
            <td>Total returns</td>
            <td>{{(result.totalReturns)}}</td>
          </tr>
        </table>
      </div>
    </div>
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
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  justify-content: center;
  align-items: center;
}

h1 {
  text-align: center;
}

.calculatorBody {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: -3px -3px 13px 0px #e6e6e6, 3px 3px 5px 3px #9d9999;
  width: 400px;
  max-width: 90vw;
  margin: auto;
}

.inputGroup {
  display: grid;

  padding: 10px;
}

input[type="number"] {
  padding: 5px 10px;
  border: 1px solid #bbb;
  border-radius: 2px;
  margin-top: 2px;
}

tr:nth-child(2n) {
  background: #fefefe;
}

tr:nth-child(2n + 1) {
  background: #ecece8;
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
}
</style>