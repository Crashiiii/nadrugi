import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { VisitService } from '../visits/visit.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  formGroup: FormGroup;
  wynik: string;
  visitCount: number;
  showCopyButton: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private visitService: VisitService
  ) {
    (this.visitCount = this.visitService.getVisitCount()),
      this.visitService.incrementVisitCount();

    this.formGroup = this.formBuilder.group({
      kwotaDochodzona: ['', Validators.required],
      kwotaZasadzona: ['', Validators.required],
      kosztyPowod: ['', Validators.required],
      kosztyPozwany: ['', Validators.required],
      punkt: ['', Validators.required],
    });
  }

  oblicz() {
    if (this.formGroup.valid) {
      const kwotaDochodzona = this.formGroup.value.kwotaDochodzona;
      const kwotaZasadzona = this.formGroup.value.kwotaZasadzona;
      const kosztyPowod = this.formGroup.value.kosztyPowod;
      const kosztyPozwany = this.formGroup.value.kosztyPozwany;
      const punkt = this.formGroup.value.punkt;
      this.showCopyButton = true;

      const procentWygranejPowoda = (kwotaZasadzona / kwotaDochodzona) * 100;
      const procentPrzegranejPowoda = 100 - procentWygranejPowoda;

      const kwotaPozwany = kosztyPozwany * (procentPrzegranejPowoda / 100);
      const kwotaPowod = kosztyPowod * (procentWygranejPowoda / 100);

      let ostatecznaKwota: number;
      let wygrany: string;
      let przegrany: string;
      if (procentWygranejPowoda > 50) {
        ostatecznaKwota = kwotaPowod - kwotaPozwany;
        wygrany = this.ktoWygra(procentWygranejPowoda);
        przegrany = this.ktoPrzegra(procentWygranejPowoda);
      } else {
        ostatecznaKwota = kwotaPozwany - kwotaPowod;
        wygrany = this.ktoWygra(procentPrzegranejPowoda);
        przegrany = this.ktoPrzegra(procentPrzegranejPowoda);
      }

      const powodzwrot = (kosztyPowod * (procentWygranejPowoda / 100)).toFixed(
        2
      );
      const pozwanyzwrot = (
        kosztyPozwany *
        (procentPrzegranejPowoda / 100)
      ).toFixed(2);

      const orzeczenie = `Orzekając o kosztach procesu w pkt ${punkt} sentencji wyroku, sąd stosunkowo rozdzielił je pomiędzy stronami na podstawie art. 100 zd. 1 k.p.c., odpowiednio do wyniku sprawy. Wartość przedmiotu sporu wynosiła ${kwotaDochodzona.toLocaleString(
        'pl-PL'
      )} złotych. 
      Powód utrzymał się z tym roszczeniem co do kwoty ${kwotaZasadzona.toLocaleString(
        'pl-PL'
      )} złotych, zatem wygrał sprawę w ${procentWygranejPowoda
        .toFixed(2)
        .replace('.', ',')} % ( ${kwotaZasadzona.toLocaleString(
        'pl-PL'
      )} / ${kwotaDochodzona.toLocaleString(
        'pl-PL'
      )} *100%), zaś przegrał w ${procentPrzegranejPowoda
        .toFixed(2)
        .replace('.', ',')} % a w tym stosunku wygrał sprawę pozwany. 
      Powód poniósł koszty procesu w wysokości ${kosztyPowod.toLocaleString(
        'pl-PL'
      )} złotych, na które składały się: …(tu uzupełnię ręcznie).
      Pozwany poniósł koszty procesu w wysokości ${kosztyPozwany.toLocaleString(
        'pl-PL'
      )} złotych, na które składały się: …(tu uzupełnię ręcznie).
      Powodowi przysługiwał zwrot kosztów od pozwanego w wysokości ${powodzwrot.toLocaleString()} złotych. Powyższa kwota została obliczona w następujący sposób: ${kosztyPowod.toLocaleString(
        'pl-PL'
      )} złotych * ${procentWygranejPowoda.toFixed(2).replace('.', ',')} %.
      Pozwanemu przysługiwał zwrot kosztów od powoda w wysokości ${pozwanyzwrot.toLocaleString()} złotych. Powyższa kwota została obliczona w następujący sposób: ${kosztyPozwany.toLocaleString(
        'pl-PL'
      )} złotych * ${procentPrzegranejPowoda.toFixed(2).replace('.', ',')} %.
      Kompensując ww. kwoty ${przegrany} ma zwrócić ${wygrany} ${ostatecznaKwota
        .toFixed(2)
        .toLocaleString()} złotych.
      Na podstawie art. 98 § 1(1) k.p.c. od kwoty zasądzonej tytułem zwrotu kosztów procesu należą się odsetki, w wysokości odsetek ustawowych za opóźnienie w spełnieniu świadczenia pieniężnego, za czas od dnia uprawomocnienia się orzeczenia, którym je zasądzono, do dnia zapłaty. Wobec powyższego zasadnym było również zasądzenie na rzecz strony wygrywającej odsetek ustawowych za opóźnienie od zasądzonych kosztów procesu.`;

      this.wynik = `${wygrany} wygrał w ${procentWygranejPowoda.toFixed(2)}%.`;
      this.wynik += `<br>${przegrany} wygrał w ${procentPrzegranejPowoda.toFixed(
        2
      )}%.`;

      if (ostatecznaKwota > 0) {
        this.wynik += `<br>${wygrany} wygrał(a) i otrzymuje ${ostatecznaKwota.toFixed(
          2
        )} zł.`;
      } else if (ostatecznaKwota < 0) {
        this.wynik += `<br>${wygrany} wygrał(a) i musi zwrócić ${przegrany} ${Math.abs(
          ostatecznaKwota
        ).toFixed(2)} zł.`;
      } else {
        this.wynik += '<br>Obie strony się kompensują, nie ma zwrotu.';
      }

      this.wynik += `<br><br>${orzeczenie}`;
    }
  }

  private ktoWygra(procent: number): string {
    return procent > 50 ? 'Powodowi' : 'Pozwanemu';
  }

  private ktoPrzegra(procent: number): string {
    return procent < 50 ? 'Powód' : 'Pozwany';
  }

  kopiujDoSchowka() {
    const plainText = this.wynik.replace(/<br>/g, '\n');
    this.clipboard.copy(plainText);
  }
  
}
